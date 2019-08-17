workflow "Deploy to website" {
  resolves = ["Install dependencies", "Deploy"]
  on = "release"
}

action "Install dependencies" {
  uses = "Borales/actions-yarn@master"
  runs = "install"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "build"
  needs = ["Install dependencies"]
}

action "Deploy" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run deploy"
  needs = ["Build"]
}
