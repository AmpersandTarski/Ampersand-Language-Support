set -e

FILENAME=$1
DEPLOYMENT=$2
SERVICE=$3

kubectl apply -f $FILENAME

while [[ $(kubectl get deployment $DEPLOYMENT -o 'jsonpath={..status.conditions[?(@.type=="Available")].status}') != "True" ]];
do echo "waiting for deployment" && sleep 1;
done

kubectl port-forward svc/$SERVICE -n default 8000:80