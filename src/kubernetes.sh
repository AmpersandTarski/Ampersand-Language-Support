set -e

# kubectl apply -f {{fileName}}
kubectl apply -f /workspaces/Ampersand-Language-Support/src/script.yaml

# $DEPLOYMENT={{deploymentName}}
# $SERVICE={{serviceName}}
$DEPLOYMENT=student
$SERVICE=student

while [[ $(kubectl get deployment $DEPLOYMENT -o 'jsonpath={..status.conditions[?(@.type=="Available")].status}') != "True" ]];
do echo "waiting for deployment" && sleep 1;
done

kubectl port-forward svc/$SERVICE -n default 8000:80