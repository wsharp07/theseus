#!/bin/bash
MONGO_RC="build/kubernetes/mongo-rc.yaml"
MONGO_SERVICE="build/kubernetes/mongo-service.yaml"
THESEUS_RC="build/kubernetes/theseus-rc.yaml"
THESEUS_SERVICE="build/kubernetes/theseus-service.yaml"
GCR="gcr.io/theseus-1239/theseus:latest"

cd ../
docker build -t $GCR .
gcloud docker push $GCR
#kubectl delete -f $MONGO_RC
kubectl delete -f $THESEUS_RC
#kubectl delete -f $MONGO_SERVICE
kubectl delete -f $THESEUS_SERVICE
#kubectl create -f $MONGO_RC
kubectl create -f $THESEUS_RC
#kubectl create -f $MONGO_SERVICE
kubectl create -f $THESEUS_SERVICE