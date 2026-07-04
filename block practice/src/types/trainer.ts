export type Side = 'left' | 'right';

// El estímulo puede ser un solo lado o, si está habilitado, ambos a la vez
export type Stimulus = Side | 'both';

export type TrainerState = Stimulus | null; // null = estado neutro