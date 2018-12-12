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

class MRbuildStripes_detailed(MRJob):
    
    OUTPUT_PROTOCOL = RawProtocol
    
    def steps(self):
        return [MRStep(
                mapper_init = self.mapper_init,
                mapper = self.mapper,
                mapper_final = self.mapper_final,
                reducer = self.reducer
                )]
    
    def mapper_init(self):
        self.chordProgressions = {}
        #firstChords = ["a", "a5", "a6", "a7sus4", "aadd9", "ab", "ab5", "abm", "abm7", "absus4", "am", "am7", "am9", "amaj9", "ao", "asus", "asus2", "asus4", "b", "b7", "bb", "bb5", "bb6sus2", "bb7", "bbm", "bbm7", "bbsus2", "bbsus4", "bm", "bm7", "bsus4", "c", "c5", "c7", "c7m", "cadd9", "cm", "cmaj7", "csus2", "d", "d5", "d7", "dadd4", "db", "db5", "dm", "dm7", "dsus", "dsus2", "dsus4", "e", "e5", "e7", "eadd9", "eb", "eb5", "ebm", "ebm7", "ebsus2", "em", "em7", "emaj9", "f", "f5", "f7", "fm", "fm7", "fmaj7", "fsus2", "g", "g13", "g5", "g6", "g7", "g9", "gb", "gb5", "gbm", "gbm7", "gbm9", "gm", "gmaj7", "go", "gsus", "gsus4"]
        firstChords = ["A-5", "A-6", "A-7-Suspended-4", "A-Add-9", "A-Flat-Minor-7", "A-Flat-Suspended-4", "A-Diminished", "A-Suspended", "A-Suspended-4", "B-Flat-6-Suspended-2", "B-Flat-7", "B-Flat-Minor", "B-Flat-Minor-7", "B-Flat-Suspended-4", "B-Suspended-4", "C-7", "D-5", "D-Add-4", "D-Minor-7", "D-Suspended", "E-5", "E-Add-9", "E-Flat-Minor", "E-Flat-Suspended-2", "F-7", "G-13", "G-5", "G-7", "G-9", "G-Flat-Major", "G-Flat-5", "G-Flat-Minor-7", "G-Flat-Minor-9", "G-Diminished", "G-Suspended", "G-Suspended-4", "G-Major", "C-Major", "D-Major", "E-Minor", "A-Minor", "A-Major", "F-Major", "E-Major", "B-Minor",  "B-Major", "C-Add-9", "D-Minor", "B-Flat-Major", "A-Flat-Major", "D-Flat-5", "A-Suspended-2", "A-Minor-7", "E-Flat-Major", "B-Flat-Five", "A-Flat-5", "A-Flat-Minor", "B-Flat-Suspended-2", "F-Minor", "E-Minor-7", "F-Minor-7", "D-suspended-4", "D-7", "F-Suspended-2", "D-Flat-Major", "E-Major-9", "F-5", "E-Flat-5", "D-Suspended-2", "E-Flat-Minor-7", "C-Major-7", "G-Flat-Minor", "C-Suspended-2", "F-Major-7", "A-Minor-9", "B-7", "C-5", "C-Minor", "B-Minor-7", "C-Minor-7", "G-6", "A-Major-9", "E-7", "G-Minor", "G-Major-7"]       
        outputChordKeys = ["A-5", "A-6", "A-7-Suspended-4", "A-Add-9", "A-Flat-Minor-7", "A-Flat-Suspended-4", "A-Diminished", "A-Suspended", "A-Suspended-4", "B-Flat-6-Suspended-2", "B-Flat-7", "B-Flat-Minor", "B-Flat-Minor-7", "B-Flat-Suspended-4", "B-Suspended-4", "C-7", "D-5", "D-Add-4", "D-Minor-7", "D-Suspended", "E-5", "E-Add-9", "E-Flat-Minor", "E-Flat-Suspended-2", "F-7", "G-13", "G-5", "G-7", "G-9", "G-Flat-Major", "G-Flat-5", "G-Flat-Minor-7", "G-Flat-Minor-9", "G-Diminished", "G-Suspended", "G-Suspended-4", "G-Major", "C-Major", "D-Major", "E-Minor", "A-Minor", "A-Major", "F-Major", "E-Major", "B-Minor",  "B-Major", "C-Add-9", "D-Minor", "B-Flat-Major", "A-Flat-Major", "D-Flat-5", "A-Suspended-2", "A-Minor-7", "E-Flat-Major", "B-Flat-Five", "A-Flat-5", "A-Flat-Minor", "B-Flat-Suspended-2", "F-Minor", "E-Minor-7", "F-Minor-7", "D-suspended-4", "D-7", "F-Suspended-2", "D-Flat-Major", "E-Major-9", "F-5", "E-Flat-5", "D-Suspended-2", "E-Flat-Minor-7", "C-Major-7", "G-Flat-Minor", "C-Suspended-2", "F-Major-7", "A-Minor-9", "B-7", "C-5", "C-Minor", "B-Minor-7", "C-Minor-7", "G-6", "A-Major-9", "E-7", "G-Minor", "G-Major-7"]
        genres = ["all_Genres", "rock", "pop", "folk", "country"]
        songKeys= ["all_Keys", "a-flat-major", "a-major", "a-minor", "b-flat-major", "b-major", "b-minor", "c-major", "d-flat-major", "d-flat-minor", "d-major", "d-minor", "e-flat-major", "e-flat-minor", "e-major", "e-minor", "f-major", "f-minor", "f-sharp-major", "g-major", "g-minor"]
        # create master dictionary with fixed indexes
        self.chordProgressions = {}
        for firstChord in firstChords:
            self.chordProgressions[firstChord] = {}
            for songKey in songKeys:
                self.chordProgressions[firstChord][songKey] = {}
                for genre in genres:
                    self.chordProgressions[firstChord][songKey][genre] = {}
                    # set default values to 0 for eached chord in fixed index
                    for chord in outputChordKeys:
                        self.chordProgressions[firstChord][songKey][genre][chord] = 0
        self.chordConversion = {"a5": "A-5", "a6": "A-6", "a7sus4": "A-7-Suspended-4", "aadd9": "A-Add-9", "abm7": "A-Flat-Minor-7", "absus4": "A-Flat-Suspended-4", "ao": "A-Diminished", "asus": "A-Suspended", "asus4": "A-Suspended-4", "bb6sus2": "B-Flat-6-Suspended-2", "bb7": "B-Flat-7", "bbm": "B-Flat-Minor", "bbm7": "B-Flat-Minor-7", "bbsus4": "B-Flat-Suspended-4", "bsus4": "B-Suspended-4", "c7": "C-7", "d5": "D-5", "dadd4": "D-Add-4", "dm7": "D-Minor-7", "dsus": "D-Suspended", "e5": "E-5", "eadd9": "E-Add-9", "ebm": "E-Flat-Minor", "ebsus2": "E-Flat-Suspended-2", "f7": "F-7", "g13": "G-13", "g5": "G-5", "g7": "G-7", "g9": "G-9", "gb": "G-Flat-Major", "gb5": "G-Flat-5", "gbm7": "G-Flat-Minor-7", "gbm9": "G-Flat-Minor-9", "go": "G-Diminished", "gsus": "G-Suspended", "gsus4": "G-Suspended-4", "g": "G-Major", "c": "C-Major", "d": "D-Major", "em": "E-Minor", "am": "A-Minor", "a": "A-Major", "f": "F-Major", "e": "E-Major", "bm": "B-Minor",  "b": "B-Major", "cadd9": "C-Add-9", "dm": "D-Minor", "bb": "B-Flat-Major", "ab": "A-Flat-Major", "db5": "D-Flat-5", "asus2": "A-Suspended-2", "am7": "A-Minor-7", "eb": "E-Flat-Major", "bb5": "B-Flat-Five", "ab5": "A-Flat-5", "abm": "A-Flat-Minor", "bbsus2": "B-Flat-Suspended-2", "fm": "F-Minor", "em7": "E-Minor-7", "fm7": "F-Minor-7", "dsus4": "D-suspended-4", "d7": "D-7", "fsus2": "F-Suspended-2", "db": "D-Flat-Major", "emaj9": "E-Major-9", "f5": "F-5", "eb5": "E-Flat-5", "dsus2": "D-Suspended-2", "ebm7": "E-Flat-Minor-7", "cmaj7": "C-Major-7", "gbm": "G-Flat-Minor", "csus2": "C-Suspended-2", "fmaj7": "F-Major-7", "am9": "A-Minor-9", "b7": "B-7", "c5": "C-5", "cm": "C-Minor", "bm7": "B-Minor-7", "c7m": "C-Minor-7", "g6": "G-6", "amaj9": "A-Major-9", "e7": "E-7", "gm": "G-Minor", "gmaj7": "G-Major-7"}
        
    def mapper(self, _, line):
        line = line.strip()
        data = re.split(";",line.lower())
        song = data[0]
        genre = data[1]
        songKey = data[2].replace(" ","-")
        chordString = re.sub(r'[\[\]]','',data[3])
        chords = re.split(",",chordString)
        # iterate through all two-chord progressionss in order
        for i in range(0, len(chords)-1):
            # print self.chordProgressions
            # create a dictionary key that includes the "key" (tone) of the song
            firstChord = self.chordConversion[chords[i].replace("'","")]
            secondChord = self.chordConversion[chords[i+1].replace("'","")]
            self.chordProgressions[firstChord][songKey][genre][secondChord] += 1
            self.chordProgressions[firstChord][songKey]["all_Genres"][secondChord] += 1
            self.chordProgressions[firstChord]["all_Keys"]["all_Genres"][secondChord] += 1
            self.chordProgressions[firstChord]["all_Keys"][genre][secondChord] += 1
                
                
    def mapper_final(self):
        for key in self.chordProgressions.keys():
            # print key+";"+json.dumps(self.chordProgressions[key])
            yield key, json.dumps(self.chordProgressions[key])

    def reducer(self, key, value):
        firstChord = key
        self.chordProgressions = {}
        self.chordProgressions[firstChord] = {}
        for v in value:
            chord_dict = json.loads(v)
            for songKey in chord_dict.keys():
                if songKey not in self.chordProgressions[firstChord].keys():
                    # create sub-array for data within this songKey
                    self.chordProgressions[firstChord][songKey] = {}
                for genre in chord_dict[songKey].keys():
                    if genre not in self.chordProgressions[firstChord][songKey].keys():
                        self.chordProgressions[firstChord][songKey][genre] = {}
                    for secondChord in chord_dict[songKey][genre]:
                        if secondChord not in self.chordProgressions[firstChord][songKey][genre]:
                            self.chordProgressions[firstChord][songKey][genre][secondChord] = chord_dict[songKey][genre][secondChord]
                        else:
                            self.chordProgressions[firstChord][songKey][genre][secondChord] += chord_dict[songKey][genre][secondChord]
        yield firstChord, json.dumps(self.chordProgressions[firstChord]) 

        
if __name__ == '__main__':
    MRbuildStripes_detailed.run()