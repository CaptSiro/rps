export enum SlotState {
    /**
     * Unchangeable slot. Cannot be opened for cash
     */
    DEFAULT,

    OPEN,

    /**
     * unlock-able for some cash
     */
    LOCKED,

    /**
     * temporarily locked slot
     */
    FROZEN,
}