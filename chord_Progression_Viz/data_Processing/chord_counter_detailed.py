##!~/anaconda2/bin/python
# -*- coding: utf-8 -*-

from __future__ import division
import re
import mrjob
import json, ast
from mrjob.protocol import RawProtocol
from mrjob.job import MRJob
from mrjob.step import MRStep
import collections as cl
import itertools

class MRchordCounter_detailed(MRJob):
    
    OUTPUT_PROTOCOL = RawProtocol
    
    def steps(self):
        return [MRStep(
                mapper_init = self.mapper_init,
                mapper = self.mapper,
                mapper_final = self.mapper_final,
                reducer = self.reducer
                )]
    
    def mapper_init(self):
        outputChordKeys = ["A-5", "A-6", "A-7-Suspended-4", "A-Add-9", "A-Flat-Minor-7", "A-Flat-Suspended-4", "A-Diminished", "A-Suspended", "A-Suspended-4", "B-Flat-6-Suspended-2", "B-Flat-7", "B-Flat-Minor", "B-Flat-Minor-7", "B-Flat-Suspended-4", "B-Suspended-4", "C-7", "D-5", "D-Add-4", "D-Minor-7", "D-Suspended", "E-5", "E-Add-9", "E-Flat-Minor", "E-Flat-Suspended-2", "F-7", "G-13", "G-5", "G-7", "G-9", "G-Flat-Major", "G-Flat-5", "G-Flat-Minor-7", "G-Flat-Minor-9", "G-Diminished", "G-Suspended", "G-Suspended-4", "G-Major", "C-Major", "D-Major", "E-Minor", "A-Minor", "A-Major", "F-Major", "E-Major", "B-Minor",  "B-Major", "C-Add-9", "D-Minor", "B-Flat-Major", "A-Flat-Major", "D-Flat-5", "A-Suspended-2", "A-Minor-7", "E-Flat-Major", "B-Flat-Five", "A-Flat-5", "A-Flat-Minor", "B-Flat-Suspended-2", "F-Minor", "E-Minor-7", "F-Minor-7", "D-suspended-4", "D-7", "F-Suspended-2", "D-Flat-Major", "E-Major-9", "F-5", "E-Flat-5", "D-Suspended-2", "E-Flat-Minor-7", "C-Major-7", "G-Flat-Minor", "C-Suspended-2", "F-Major-7", "A-Minor-9", "B-7", "C-5", "C-Minor", "B-Minor-7", "C-Minor-7", "G-6", "A-Major-9", "E-7", "G-Minor", "G-Major-7"]
        #outputChordKeys = ["G-Major", "C-Major", "D-Major", "E-Minor", "A-Minor", "A-Major", "F-Major", "E-Major", "B-Minor",  "B-Major", "C-Add-9", "D-Minor", "B-Flat-Major", "A-Flat-Major", "D-Flat-5", "A-Suspended-2", "A-Minor-7", "E-Flat-Major", "B-Flat-Five", "A-Flat-5", "A-Flat-Minor", "B-Flat-Suspended-2", "F-Minor", "E-Minor-7", "F-Minor-7", "D-suspended-4", "D-7", "F-Suspended-2", "D-Flat-Major", "E-Major-9", "F-5", "E-Flat-5", "D-Suspended-2", "E-Flat-Minor-7", "C-Major-7", "G-Flat-Minor", "C-Suspended-2", "F-Major-7", "A-Minor-9", "B-7", "C-5", "C-Minor", "B-Minor-7", "C-Minor-7", "G-6", "A-Major-9", "E-7", "G-Minor", "G-Major-7"]
        genres = ["all_Genres", "rock", "pop", "folk", "country"]
        songKeys= ["all_Keys", "a-flat-major", "a-major", "a-minor", "b-flat-major", "b-major", "b-minor", "c-major", "d-flat-major", "d-flat-minor", "d-major", "d-minor", "e-flat-major", "e-flat-minor", "e-major", "e-minor", "f-major", "f-minor", "f-sharp-major", "g-major", "g-minor"]
        # create master dictionary with fixed indexes
        self.chordProgressions = {}
        for songKey in songKeys:
            self.chordProgressions[songKey] = {}
            for genre in genres:
                self.chordProgressions[songKey][genre] = {}
                # set default values to 0 for eached chord in fixed index
                for chord in outputChordKeys:
                    self.chordProgressions[songKey][genre][chord] = 0
        self.chordConversion = {"a5": "A-5", "a6": "A-6", "a7sus4": "A-7-Suspended-4", "aadd9": "A-Add-9", "abm7": "A-Flat-Minor-7", "absus4": "A-Flat-Suspended-4", "ao": "A-Diminished", "asus": "A-Suspended", "asus4": "A-Suspended-4", "bb6sus2": "B-Flat-6-Suspended-2", "bb7": "B-Flat-7", "bbm": "B-Flat-Minor", "bbm7": "B-Flat-Minor-7", "bbsus4": "B-Flat-Suspended-4", "bsus4": "B-Suspended-4", "c7": "C-7", "d5": "D-5", "dadd4": "D-Add-4", "dm7": "D-Minor-7", "dsus": "D-Suspended", "e5": "E-5", "eadd9": "E-Add-9", "ebm": "E-Flat-Minor", "ebsus2": "E-Flat-Suspended-2", "f7": "F-7", "g13": "G-13", "g5": "G-5", "g7": "G-7", "g9": "G-9", "gb": "G-Flat-Major", "gb5": "G-Flat-5", "gbm7": "G-Flat-Minor-7", "gbm9": "G-Flat-Minor-9", "go": "G-Diminished", "gsus": "G-Suspended", "gsus4": "G-Suspended-4", "g": "G-Major", "c": "C-Major", "d": "D-Major", "em": "E-Minor", "am": "A-Minor", "a": "A-Major", "f": "F-Major", "e": "E-Major", "bm": "B-Minor",  "b": "B-Major", "cadd9": "C-Add-9", "dm": "D-Minor", "bb": "B-Flat-Major", "ab": "A-Flat-Major", "db5": "D-Flat-5", "asus2": "A-Suspended-2", "am7": "A-Minor-7", "eb": "E-Flat-Major", "bb5": "B-Flat-Five", "ab5": "A-Flat-5", "abm": "A-Flat-Minor", "bbsus2": "B-Flat-Suspended-2", "fm": "F-Minor", "em7": "E-Minor-7", "fm7": "F-Minor-7", "dsus4": "D-suspended-4", "d7": "D-7", "fsus2": "F-Suspended-2", "db": "D-Flat-Major", "emaj9": "E-Major-9", "f5": "F-5", "eb5": "E-Flat-5", "dsus2": "D-Suspended-2", "ebm7": "E-Flat-Minor-7", "cmaj7": "C-Major-7", "gbm": "G-Flat-Minor", "csus2": "C-Suspended-2", "fmaj7": "F-Major-7", "am9": "A-Minor-9", "b7": "B-7", "c5": "C-5", "cm": "C-Minor", "bm7": "B-Minor-7", "c7m": "C-Minor-7", "g6": "G-6", "amaj9": "A-Major-9", "e7": "E-7", "gm": "G-Minor", "gmaj7": "G-Major-7"}
           
        
    def mapper(self, _, line):
        line = line.strip()
        data = re.split(";",line.lower())
        song = data[0]
        genre = data[1]
        songKey = data[2].replace(" ","-")
        chordString = re.sub(r'[\[\]]','',data[3])
        chords = re.split(",",chordString)
        # dictionary and array of values for processing
        chordsWeCareAbout = ["a", "am", "b", "bb", "bm", "c", "cadd9", "d", "db", "dm", "e", "em", "fm", "g", "gm"]
        # iterate through all two-chord progressionss in order
        for chord in chords:
            if chord.replace("'","") in chordsWeCareAbout:
                chord = self.chordConversion[chord.replace("'","")]
                # see if the songKey the dictionary for this firstSong
                if songKey not in self.chordProgressions.keys():
                    # create sub-array for data within this songKey
                    self.chordProgressions[songKey] = {}
                    self.chordProgressions[songKey][genre] = {}
                    self.chordProgressions[songKey][genre][chord] = 1
                    self.chordProgressions[songKey]["all_Genres"] = {}
                    self.chordProgressions[songKey]["all_Genres"][chord] = 1
                    # see if the chord is found in the all genres dictionary for all songKeys
                    if chord not in self.chordProgressions["all_Keys"]["all_Genres"]:    
                        self.chordProgressions["all_Keys"]["all_Genres"][chord] = 1
                    else:
                        self.chordProgressions["all_Keys"]["all_Genres"][chord] += 1
                    # see if the current genre is found in the all songKeys dictionary
                    if genre not in self.chordProgressions["all_Keys"].keys():
                        self.chordProgressions["all_Keys"][genre] = {}
                        self.chordProgressions["all_Keys"][genre][chord] = 1
                    else:
                        # check to see if there is an existing entry to add to
                        if chord not in self.chordProgressions["all_Keys"][genre]:
                            self.chordProgressions["all_Keys"][genre][chord] = 1
                        else:
                            self.chordProgressions["all_Keys"][genre][chord] += 1
                # see if the genre is in the deictionary for this songKey
                elif genre not in self.chordProgressions[songKey].keys():
                    self.chordProgressions[songKey][genre] = {}
                    self.chordProgressions[songKey][genre][chord] = 1
                    # see if the chord is found in the all genres dictionary for all songKeys
                    if chord not in self.chordProgressions["all_Keys"]["all_Genres"]:    
                        self.chordProgressions["all_Keys"]["all_Genres"][chord] = 1
                    else:
                        self.chordProgressions["all_Keys"]["all_Genres"][chord] += 1
                    # see if the current genre is found in the all songKeys dictionary
                    if genre not in self.chordProgressions["all_Keys"].keys():
                        self.chordProgressions["all_Keys"][genre] = {}
                        self.chordProgressions["all_Keys"][genre][chord] = 1
                    else:
                        # check to see if there is an existing entry to add to
                        if chord not in self.chordProgressions["all_Keys"][genre]:
                            self.chordProgressions["all_Keys"][genre][chord] = 1
                        else:
                            self.chordProgressions["all_Keys"][genre][chord] += 1
                    # see if the second chord is in the data for all genres in this songKey
                    if chord not in self.chordProgressions[songKey]["all_Genres"]:
                        self.chordProgressions[songKey]["all_Genres"][chord] = 1
                    else:
                        self.chordProgressions[songKey]["all_Genres"][chord] += 1
                # otherwise we just need to increase the counts appropriately
                elif chord not in self.chordProgressions[songKey][genre]:
                    self.chordProgressions[songKey][genre][chord] = 1
                    # see if the chord is found in the all genres dictionary for all songKeys
                    if chord not in self.chordProgressions["all_Keys"]["all_Genres"]:    
                        self.chordProgressions["all_Keys"]["all_Genres"][chord] = 1
                    else:
                        self.chordProgressions["all_Keys"]["all_Genres"][chord] += 1
                    # we know the genre is in "all_keys" dictionary from the "elif genre" above
                    # but we still need to see if the second chord is in the data for this genre in all keys
                    if chord not in self.chordProgressions["all_Keys"][genre]:
                        self.chordProgressions["all_Keys"][genre][chord] = 1
                    else:
                        self.chordProgressions["all_Keys"][genre][chord] += 1
                    # we know the songKey is in "firstChord" dictionary from the "elif songKey" above
                    # but we still need to see if the second chord is in the data for all genres in this songKey
                    if chord not in self.chordProgressions[songKey]["all_Genres"]:
                        self.chordProgressions[songKey]["all_Genres"][chord] = 1
                    else:
                        self.chordProgressions[songKey]["all_Genres"][chord] += 1    
                else:
                    self.chordProgressions[songKey][genre][chord] += 1
                    self.chordProgressions[songKey]["all_Genres"][chord] += 1
                    self.chordProgressions["all_Keys"]["all_Genres"][chord] += 1
                    self.chordProgressions["all_Keys"][genre][chord] += 1
                
    def mapper_final(self):
        for key in self.chordProgressions.keys():
            # print key+";"+json.dumps(self.chordProgressions[key])
            yield key, json.dumps(self.chordProgressions[key])

    def reducer(self, key, value):
        self.chordProgressions = {}
        for v in value:
            chord_dict = json.loads(v)
            for genre in chord_dict.keys():
                if genre not in self.chordProgressions.keys():
                    # create sub-array for data within this songKey
                    self.chordProgressions[genre] = {}
                    for chord in chord_dict[genre]:
                        if chord not in self.chordProgressions[genre]:
                            self.chordProgressions[genre][chord] = chord_dict[genre][chord]
                        else:
                            self.chordProgressions[genre][chord] += chord_dict[genre][chord]
        yield key, json.dumps(self.chordProgressions) 
        
if __name__ == '__main__':
    MRchordCounter_detailed.run()