set -e

filename=$1
deployment=$2
service=$3

kubectl apply -f $filename

kubectl rollout status deployment/$deployment --timeout=300s

kubectl port-forward svc/$service -n default 8000:80