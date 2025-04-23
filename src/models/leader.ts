export interface Leader {
    leaderId: number;
    leaderName: string;
    leaderPhone: string;
    leaderRole: string;
    leaderColor: string;
}

export enum LeaderRole {
    ADMIN = 'ADMIN',
    LEADER = 'LEADER',
    REGISTRANT = 'REGISTRANT'
}

export enum LeaderColor {
    RED = 'RED',
    BLUE = 'BLUE',
    GREEN = '#008000',
    YELLOW = '#FFFF00',
    ORANGE = '#FFA500',
    PURPLE = '#800080',
    PINK = '#FFC0CB',
    BROWN = '#A52A2A',
    BLACK = '#000000',
    WHITE = '#FFFFFF'
}