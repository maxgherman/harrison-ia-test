export type User = {
    id: string
    issuer: string
    email: string
}

export type Label = {
    id: string
    value: string
}

export type Image = {
    id: string
    fileName: string
    status: string
    date: Date
    labels: { [key: string]: Label }
}
