type ObjectRef = {
    apiVersion: string;
    kind: string;
    name: string;
    uid: string;
}

export type Application = {
    metadata: {
        name: string;
        ownerReferences?: ObjectRef[];
    };
}

export function getOwner(application: Application): ObjectRef | null {
    if(!application) {
        return null;
    }

    const ownerRef = application.metadata.ownerReferences?.find((ref: ObjectRef) => ref.kind === 'ApplicationSet');
    if(!ownerRef) {
        return null;
    }

    return ownerRef;
}
