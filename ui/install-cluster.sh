!#/bin/bash

set -euox pipefail

pod=$(kubectl get pod -l "app.kubernetes.io/name=argocd-server" -o jsonpath='{.items[0].metadata.name}')

# Cleanup previous installation
kubectl exec $pod -c argocd-server -- bash -c "rm -rf /tmp/progressive-sync-extension && mkdir /tmp/progressive-sync-extension"

# Copy tar file to container
kubectl cp -c argocd-server ./extension.tar.gz $pod:/tmp/progressive-sync-extension/extension.tar.gz

# Unpack tar file
kubectl exec $pod -c argocd-server -- tar -zxf /tmp/progressive-sync-extension/extension.tar.gz -C /tmp/progressive-sync-extension
kubectl exec $pod -c argocd-server -- bash -c "[ ! -d '/tmp/extensions/resources' ] && mkdir -p /tmp/extensions/resources || true"
kubectl exec $pod -c argocd-server -- bash -c "cp -Rf /tmp/progressive-sync-extension/resources/* /tmp/extensions/resources/"

