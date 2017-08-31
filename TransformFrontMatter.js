const fs = require('fs')
const yaml = require('js-yaml')

// SUMMARY:  Transform front matter by removing unnecessary fields,
// and rearranging fields in a format that works well with siteleaf

// Projects yaml transformation will:
// 1.) expand the practice area string, and place it in a Yaml array
// 2.) take the description field and move its contents to the 2nd document of this 
// yaml document(Note: jekyll frontmatter is actually two yaml documents separated by ---)
// 3.) Remove unnecessary fields we don't want to show up in siteleaf
const projectsPath = '_projects/'
fs.readdirSync(projectsPath).forEach((fileName) => {
  const projectYaml = yaml.safeLoadAll(fs.readFileSync(projectsPath + fileName, 'utf8'))
  const projectData = projectYaml[0]
  console.log(`transforming practice areas for: ${projectsPath}${fileName}`)
  const transformedData = transformYesNoToBoolean(transformPracticeAreas(projectData), 'Is Current Project? (true/false)')
  const projectDescription = transformedData['description'] // Description will later be appended to the document

  // remove fields
  const practiceAreaColumns = yaml.safeLoad(fs.readFileSync('_data/project_column_names.yaml', 'utf8')).filter((column) => column.type === 'practice_area').map((column) => column['key'])
  const fieldsToDelete = [
    'description', // will be included in content so it's not needed
    'Point of contact',
    'Email',
    'Phone',
    'Prime',
    'Contract Number',
    'Sub',
    'Link',
    'Link to the document file',
    'Document Title',
    'Subcontract Number/Order Number/Grant Number'
  ].concat(practiceAreaColumns)
  fieldsToDelete.forEach((fieldName) => {
    delete transformedData[fieldName]
  })
  const transformedYaml = yaml.safeDump(transformedData)

  console.log(`writing new yaml for: ${projectsPath}${fileName}`)
  fs.writeFileSync(projectsPath + fileName, '---\n')
  fs.appendFileSync(projectsPath + fileName, transformedYaml)
  fs.appendFileSync(projectsPath + fileName, '---\n')
  fs.appendFileSync(projectsPath + fileName, projectDescription)
})

// Publications yaml transformation will
// 1.) expand the practice area string, and place it in a Yaml array
const publicationsPath = '_publications/'
fs.readdirSync(publicationsPath).forEach((fileName) => {
  const publicationYaml = yaml.safeLoadAll(fs.readFileSync(publicationsPath + fileName, 'utf8'))
  const publicationData = publicationYaml[0]
  console.log(`transforming practice areas for: ${projectsPath}${fileName}`)
  const transformedData = transformPracticeAreas(publicationData)
  const transformedYaml = yaml.safeDump(transformedData)

  console.log(`writing new yaml for: ${publicationsPath}${fileName}`)
  fs.writeFileSync(publicationsPath + fileName, '---\n')
  fs.appendFileSync(publicationsPath + fileName, transformedYaml)
  fs.appendFileSync(publicationsPath + fileName, '---\n')
})

function transformPracticeAreas(project) {
  const delimiter = '~'
  const practiceAreasAsString = project['Practice Area'] || ''
  const practiceAreasAsArray = practiceAreasAsString.split(delimiter)
  return Object.assign({}, project, { 'Practice Area': practiceAreasAsArray })
}

function transformYesNoToBoolean(project, columnName) {
  const transformedProject = Object.assign({}, project)
  if(project[columnName].toLowerCase() == 'no') {
    transformedProject[columnName] = false
  } else if (project[columnName].toLowerCase() === 'yes') {
    transformedProject[columnName] = true
  }
  return transformedProject
}
