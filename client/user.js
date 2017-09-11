class User {
    constructor() {
        this.data ={}
    }

    get() {
        return this.data
    }

    load() {
        this.data = (localStorage['hedgeable']) ? JSON.parse(localStorage['hedgeable']) : {}
    }

    save() {
        localStorage['hedgeable'] = (this.data) ? JSON.stringify(this.data) : '{}'
    }

    delete() {
        this.data ={}
        localStorage['hedgeable'] = '{}'
    }
}

let user = new User()
    user.load()

export default user

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 USER Model

 User = {
    token: 'string'
 }

 */
