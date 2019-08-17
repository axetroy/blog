workflow "Deploy to website" {
  resolves = ["Run in Master", "Install dependencies", "Build", "Deploy"]
  on = "release"
}

action "Run in Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Install dependencies" {
  uses = "Borales/actions-yarn@master"
  args = "install"
  needs = ["Run in Master"]
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build"
  needs = ["Install dependencies"]
}

action "Deploy" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run deploy"
  needs = ["Build"]
}
