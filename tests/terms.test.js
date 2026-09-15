import test from 'node:test';
import assert from 'node:assert/strict';
import {termRange,inTerm,currentTerm} from '../dist/core.js';
test('academic boundaries include last day and exclude adjacent terms',()=>{
 for(const [term,start,end,before,after] of [
  ['Fall 2026','2026-09-01','2026-12-31','2026-08-31','2027-01-01'],
  ['Winter 2028','2028-01-01','2028-04-30','2027-12-31','2028-05-01'],
  ['Summer 2026','2026-05-01','2026-08-31','2026-04-30','2026-09-01']]){
  assert.deepEqual(termRange(term),{start,end});
  for(const date of [start,end])assert.equal(inTerm(date,term),true);
  for(const date of [before,after])assert.equal(inTerm(date,term),false);
 }
 assert.equal(inTerm('2028-02-29','Winter 2028'),true);
});
test('legacy terms keep records accessible and season parsing is tolerant',()=>{
 assert.equal(termRange('Full year 2026'),null);
 assert.equal(inTerm('2026-08-15','Full year 2026'),true);
 assert.deepEqual(termRange(' winter 2027 '),{start:'2027-01-01',end:'2027-04-30'});
});
test('new assignment defaults follow the local calendar',()=>{
 for(const [month,season] of [[0,'Winter'],[3,'Winter'],[4,'Summer'],[7,'Summer'],[8,'Fall'],[11,'Fall']])assert.equal(currentTerm(new Date(2027,month,1)),season+' 2027');
});
