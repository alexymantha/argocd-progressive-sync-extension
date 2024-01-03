!#/bin/bash
# Script to install the extension on a running argocd-server pod on the current context.
# Usage: yarn build && ./install-cluster.sh
# To change the namespace, set the NAMESPACE environment variable.

set -euox pipefail

NAMESPACE="${NAMESPACE:-argocd}"

pod=$(kubectl get pod -n argocd -l "app.kubernetes.io/name=argocd-server" -o jsonpath='{.items[0].metadata.name}')
echo "Installing extension in pod ${pod} in namespace ${NAMESPACE}"

# Cleanup previous installation
kubectl exec -n argocd $pod -c argocd-server -- bash -c "rm -rf /tmp/progressive-sync-extension && mkdir /tmp/progressive-sync-extension"

# Copy tar file to container
kubectl cp -n argocd -c argocd-server ./extension.tar.gz $pod:/tmp/progressive-sync-extension/extension.tar.gz

# Unpack tar file
kubectl exec -n argocd $pod -c argocd-server -- tar -zxf /tmp/progressive-sync-extension/extension.tar.gz -C /tmp/progressive-sync-extension
kubectl exec -n argocd $pod -c argocd-server -- bash -c "[ ! -d '/tmp/extensions/resources' ] && mkdir -p /tmp/extensions/resources || true"
kubectl exec -n argocd $pod -c argocd-server -- bash -c "cp -Rf /tmp/progressive-sync-extension/resources/* /tmp/extensions/resources/"

