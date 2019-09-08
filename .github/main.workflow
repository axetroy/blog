workflow "Deploy to website" {
  resolves = ["Install dependencies", "Build", "If Run in Master", "Deploy"]
  on = "push"
}

action "Install dependencies" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build"
  needs = ["Install dependencies"]
}

action "If Run in Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
  needs = ["Build"]
}

action "Deploy" {
  uses = "axetroy/gh-pages-action@0.0.9"
  needs = ["If Run in Master"]
  secrets = ["GITHUB_TOKEN"]
  env = {
    REPO = "https://github.com/axetroy/axetroy.github.io.git"
    BRANCH = "master"
    DIST = "build"
    USER = "axetroy <axetroy.dev@gmail.com>"
  }
}
