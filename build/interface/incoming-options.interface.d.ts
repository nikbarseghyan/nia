export interface IncomingOptionsI {
    esOpts: {
        esPort?: string;
        esHost?: string;
        log?: string;
        apiVersion?: string;
        requestTimeout?: number;
    };
    esIdx?: string;
    esType?: string;
    moUrl: string;
    moColl: string;
    pQueue: number;
}
