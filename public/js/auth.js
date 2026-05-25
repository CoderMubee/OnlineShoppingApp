
// HANDLE REGISTER
export async function registerUser(payload) {

    const res = await fetch('/register/users', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message);
    }

    return data;
}

//HANDLE LOGIN
export async function loginUser(payload) {

    const res = await fetch('/loginUser', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message);
    }

    return data;
}


