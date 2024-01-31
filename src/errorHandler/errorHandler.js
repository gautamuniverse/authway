export default class AppplicationError extends Error{
    constructor(message, code)
    {
        super(message);
        this.code = code;
    }
}