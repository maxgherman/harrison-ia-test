type Environment = {
    value: string
}

type Server = {
    port: number
    sessionSecret: string
}

type AuthServer = {
    secret: string
    key: string
}

type DataBaseServer = {
    user: string
    password: string
    host: string
    database: string
    port: number
}

export const environment: Readonly<Environment> = {
    get value(): string {
        return process.env.ENVIRONMENT as string
    }
}

export const server: Readonly<Server> = {
    get port(): number {
        return parseInt(process.env.PORT as string)
    },

    get sessionSecret(): string {
        return process.env.SESSION_SECRET as string
    }
}

export const autServer: Readonly<AuthServer> = {
    get secret(): string {
        return process.env.MAGIC_SECRET_KEY as string
    },

    get key(): string {
        return process.env.MAGIC_PUBLISHABLE_KEY as string
    }
}

export const databaseServer: Readonly<DataBaseServer> = {
    get user(): string {
        return process.env.DBUSER as string
    },

    get password(): string {
        return process.env.DBPASSWORD as string
    },

    get host(): string {
        return process.env.DBHOST as string
    },

    get database(): string {
        return process.env.DATABASE as string
    },

    get port(): number {
        return parseInt(process.env.DBPORT as string)
    }
}