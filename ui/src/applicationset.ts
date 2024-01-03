export function isProgressing(applicationset: any, appName: string) {
    if (!applicationset) {
        return false;
    }

    const status = applicationset.status.applicationStatus ?? [];
    if(status.length === 0) {
        return false;
    }

    const applicationStatus = status.find((status: any) => status.application === appName); 
    if (!applicationStatus) {
        return false;
    }

    return applicationStatus.status === "Waiting" || applicationStatus.status === "Pending";
}
