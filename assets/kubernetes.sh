set -e

while getopts f:d:s: flag
do
    case "${flag}" in
        f) filename=${OPTARG};;
        d) deployment=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

kubectl apply -f $filename

while [[ $(kubectl get deployment $deployment -o 'jsonpath={..status.conditions[?(@.type=="Available")].status}') != "True" ]];
do echo "waiting for deployment" && sleep 1;
done

kubectl port-forward svc/$service -n default 8000:80