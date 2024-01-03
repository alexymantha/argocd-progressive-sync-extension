
type ObjectRef = {
    apiVersion: string;
    kind: string;
    name: string;
    uid: string;
}

export function getOwner(application: any): ObjectRef | null {
    if(!application) {
        return null;
    }

    const ownerRef = application.metadata.ownerReferences?.find((ref: any) => ref.kind === 'ApplicationSet');
    console.log(ownerRef)
    if(!ownerRef) {
        return null;
    }

    return {
        apiVersion: ownerRef.apiVersion,
        kind: ownerRef.kind,
        name: ownerRef.name,
        uid: ownerRef.uid,
    };
}
