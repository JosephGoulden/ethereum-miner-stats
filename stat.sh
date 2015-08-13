#!/bin/env bash

while [ true ]; do
 sleep 2

 top -bn2 | head -12 > rep.temp
 
 echo '\n' >> rep.temp

 aticonfig --adapter=all --odgc >> rep.temp
 aticonfig --adapter=all --odgt >> rep.temp

 cp -f rep.temp rep
done
