#!~/anaconda2/bin/python
# -*- coding: utf-8 -*-

from __future__ import division
import collections
import re
import json
import math
import numpy as np
import itertools
import mrjob
from mrjob.protocol import RawProtocol
from mrjob.job import MRJob
from mrjob.step import MRStep
from collections import defaultdict
import collections as cl
import itertools

class MRnormalizedChordCounts_detailed(MRJob):
    
  #START SUDENT CODE531_INV_INDEX
    SORT_VALUES = True
    def steps(self):
        JOBCONF_STEP = { 
          ######### IMPORTANT: THIS WILL HAVE NO EFFECT IN -r local MODE. MUST USE -r hadoop FOR SORTING #############
            'mapreduce.job.output.key.comparator.class': 'org.apache.hadoop.mapred.lib.KeyFieldBasedComparator',
            'mapreduce.partition.keycomparator.options':'-k1',
        }
        return [
                MRStep(
                    jobconf=JOBCONF_STEP,
                    mapper_init = self.mapper_init,
                    mapper = self.mapper,
                    mapper_final = self.mapper_final,
                    reducer_init =self.reducer_init,
                    reducer = self.reducer,
                    reducer_final = self.reducer_final)
                ]
    
    def mapper_init(self):
        self.chordProgressions = {}
    
    def mapper(self, _, line):
        key, value = line.strip().split('\t')
        self.chordProgressions[key] = {}
        self.chordProgressions[key] = json.loads(value)
        # find the total count of chord progressions in the diectionary
        for genre in self.chordProgressions[key].keys():
            normalizationCount = 0
            for nextChord in self.chordProgressions[key][genre].keys():
                normalizationCount += int(self.chordProgressions[key][genre][nextChord])
            for nextChord in self.chordProgressions[key][genre].keys():
                if normalizationCount != 0:
                    self.chordProgressions[key][genre][nextChord] = int(self.chordProgressions[key][genre][nextChord])/normalizationCount
                else:
                    self.chordProgressions[key][genre][nextChord]

    def mapper_final(self):
        for key in self.chordProgressions.keys():
            yield key , json.dumps(self.chordProgressions[key])
    
    
    def reducer_init(self):
        self.full_dict = {}
    
    # the reducer is purely being used for sortation
    def reducer(self, key, value):
        songKey = key
        #songKey = str('"'+key+'"')
        # songKey  = key.replace(r"'","")
        # print str('"'+songKey+'", ')
        for v in value:
            temp = json.loads(v)
        self.full_dict[songKey] = {}
        self.full_dict[songKey] = temp
        # print songKey, json.dumps(temp), "\n"
        
    def reducer_final(self):
        #yield "chord_dict", json.dumps(self.full_dict)
        print json.dumps(self.full_dict), "\n"
        
if __name__ == '__main__':
    MRnormalizedChordCounts_detailed.run()