const read = require('read')
const ldap = require('ldapjs')

const config = {
	url: 'ldap://mainsim.etit.tu-chemnitz.de',
	bindDN: 'uid=e.lorenz,ou=People,dc=etit,dc=tu-chemnitz,dc=de',
	searchBase: 'ou=People,dc=etit,dc=tu-chemnitz,dc=de',
	searchFilter: '(uid={{username}})',
	groupSearchBase: 'ou=Group,dc=etit,dc=tu-chemnitz,dc=de',
	groupSearchFilter: '(|(cn={{username}})(memberUid={{username}}))'
};

let client = ldap.createClient({url:config.url});

read({prompt: 'baseDN pass: ', silent: true}, (err,pass) => {
	client.bind(config.bindDN, pass, (err, res) => {
		if (err) {
			console.error(err)
			return 
		}
		client.search(config.groupSearchBase, {scope: 'sub', attributes: ['dn', 'memberUid', 'cn']}, (err, res) => {
			res.on('searchEntry', entry => console.log(JSON.stringify(entry.object)))
			res.on('end', res => {
			})
		})
	})
})
