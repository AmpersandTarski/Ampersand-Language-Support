set -e

filename=$1
deployment="student"
service="student"

# check if the user provided arguments
if [ $# -gt 1 ]; then
  # assign the first argument to DEPLOYMENT
  deployment=$2
fi

if [ $# -gt 2 ]; then
  # assign the second argument to SERVICE
  service=$3
fi

kubectl apply -f $filename

kubectl wait --for=condition=available --timeout=300s deployment/$deployment

kubectl port-forward svc/$service -n default 8000:80