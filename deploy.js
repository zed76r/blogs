const ghp = require('gh-pages')

ghp.publish("public", {
    branch: 'test-gh-pages',
    repo: `https://${process.env.GH_TOKEN}@github.com/zedd-dev/www.git`,
    user: {
        name: "Zed",
        email: "ghpages@zedd.dev"
    }
}, err => {
    if(err) {
        console.error(err)
        throw err
    }
})