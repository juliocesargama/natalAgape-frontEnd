export interface family {
    familyId: number;
    responsibleName: string;
    phoneNumber: string;
    address: string;
    neighborhoodName: string;
    observations: string;
    children: Array<{
        childName: string;
    }>;
}