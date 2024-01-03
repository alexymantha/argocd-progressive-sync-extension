type ApplicationStatus = {
    application: string;
    status: string;
    message: string;
    step: string;
}

type ApplicationSet = {
    status: {
        applicationStatus?: ApplicationStatus[];
    };
}

export function isProgressing(applicationset: ApplicationSet, appName: string) {
    if (!applicationset) {
        return false;
    }

    const status = applicationset.status.applicationStatus ?? [];
    if(status.length === 0) {
        return false;
    }

    const applicationStatus = status.find((status: ApplicationStatus) => status.application === appName); 
    if (!applicationStatus) {
        return false;
    }

    return applicationStatus.status === "Waiting" || applicationStatus.status === "Pending";
}
