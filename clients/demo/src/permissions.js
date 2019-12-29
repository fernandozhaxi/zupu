//export const CIPH_GROUP = "acl_ciph_w";
//export const CIPH_GROUP = "cad_uk";

export const CIPH_CONTRIBUTORS = (() => {
        //let userGroups = djangoUserGroups.replace(/\{/g, '[').replace(/\}/g, ']').replace(/'/g, '"');
        let users = CIPH_contributors.replace(/'/g, '"');
        return JSON.parse(users);
        //let b = JSON.stringify(let userGroups);
        //let c = let userGroups.map(e => <div>{e}</div>);
})()

export const USER_IS_CIPH = (() => {
        if (CIPH_CONTRIBUTORS.includes(djangoUsername)) {
                return true
        } else {
                return false
        }
})()
