import Big from 'big.js';
export interface campaign {
    campaignId: number;
    campaignYear: number;
    campaignChurch: string;
    foodBasketValue: Big;
}