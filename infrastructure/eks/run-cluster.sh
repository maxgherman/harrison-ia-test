#!/bin/bash

ACTION=$1
STACK="harrison-project-eks-cluster"
TEMPLATE="eks-cluster.yaml"
PARAMS="parameters.json"

./run.sh $ACTION $STACK $TEMPLATE $PARAMS
