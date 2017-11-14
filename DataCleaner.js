const ExcelUtil = require('xlsx')
const os = require('os')
const fs = require('fs')
const yaml = require('js-yaml')
const slugify = require('slugify')

const homeDir = os.homedir()
const workbook = ExcelUtil.readFile(`./The Project Database 2_UPDATED_FINAL.xlsm`)
const sheetNames = workbook.SheetNames

const MAIN_SHEET_NAME = 'MASTER'
debugger;
const mainSheetAsJson = ExcelUtil.utils.sheet_to_json(workbook.Sheets[MAIN_SHEET_NAME])
const cleanedJson = cleanRecords(mainSheetAsJson)

const projectsJson = prepareProjectsJson(cleanedJson)
const publicationsJson = preparePublicationsJson(cleanedJson)

const projectsSheet = ExcelUtil.utils.json_to_sheet(projectsJson)
const publicationsSheet = ExcelUtil.utils.json_to_sheet(publicationsJson)

const projectsCSV = ExcelUtil.utils.sheet_to_csv(projectsSheet, { FS: "\t" })
const publicationsCSV = ExcelUtil.utils.sheet_to_csv(publicationsSheet, { FS: "\t" })

fs.writeFileSync('projects.tsv', projectsCSV)
fs.writeFileSync('publications.tsv', publicationsCSV)

// Transform data for yaml(mostly take the practice areas and put them in one column)
function prepareProjectsJson(cleanProjects) {
  return addSlugFor('Project Title', 'projects_slug', cleanProjects.map(combinePracticeAreaColumns))
}

function preparePublicationsJson(cleanProjects) {
  const DOCUMENT_LINK_COLUMN_NAME = 'Link'
  const DOCUMENT_TITLE_COLUMN_NAME = 'Document Title'

  let publications = []
  cleanProjects.forEach((project) => {
    const publication = {}
    let title = project[DOCUMENT_TITLE_COLUMN_NAME]
    let link = project[DOCUMENT_LINK_COLUMN_NAME]
    if(title || link) {
      if(title) {
        publication['data_id'] = project['data_id']
        publication['title'] = title
        publication['Document URL'] = link
        publication['Practice Area'] = combinePracticeAreaColumns(project)['Practice Area']
        publications.push(publication)
        return
      }
      if(link) {
        // Use link for title if there is no 
        publication['data_id'] = project['data_id']
        publication['title'] = link
        publication['Document URL'] = link
        publication['Practice Area'] = combinePracticeAreaColumns(project)['Practice Area']
        publications.push(publication)
        return
      }
    }
  })

  return addSlugFor('title', 'publications_slug', publications)
}

function addSlugFor(slugSourceColumn, slugDestinationColumn, data) {
  let sluggedData = []
  data.forEach((datum, index) => {
    const newDatum = Object.assign({}, datum)
    const preSluggedString = String(datum[slugSourceColumn]) || (slugSourceColumn + "-" + datum.data_id)
    newDatum[slugDestinationColumn] = removeQuotes(slugify(shorten(preSluggedString)))
    sluggedData.push(newDatum)
  })

  return sluggedData
}

// Combine the multiple columns of practice areas into just one column that lists each practice area
function combinePracticeAreaColumns(record) {
  const delimiter = "~"
  const practiceAreaColumns = yaml.safeLoad(fs.readFileSync('_data/project_column_names.yaml', 'utf8')).filter((column) => column.type === 'practice_area')
  let foundPracticeAreas = []
  practiceAreaColumns.forEach((practiceArea) => {
    const paKey = practiceArea['key']
    const paDisplayName = practiceArea['displayName'] // Yay for display names
    if(record[paKey] === 'x') {
      foundPracticeAreas.push(paDisplayName)
    }
  })
  foundPracticeAreas = foundPracticeAreas.join(delimiter)
  
  const recordWithCombinedPA = Object.assign({}, record, { 'Practice Area': foundPracticeAreas})
  return recordWithCombinedPA
}

// Clean records of newlines etc
function cleanRecords(records) {
  return records.map(cleanRecord)
}

function cleanRecord(record, index) {
  let cleanedRecord = {}
  // Add an ID to each record
  cleanedRecord['data_id'] = index
  Object.keys(record).forEach((key) => {
    let value = record[key]
    cleanedRecord[cleanString(key)] = cleanString(value)
  })

  return cleanedRecord
}

function cleanString(string) {
  return escapeQuotes(trimWhiteSpace(removeNewLines(string)))
}

function removeNewLines(string) {
  return string.replace(/[\n\r]/g, '')
}

function trimWhiteSpace(string) {
  return string.trim()
}

function escapeQuotes(string) {
  return string.replace(/"/g, '\\"')
}

function removeQuotes(string) {
  return string.replace(/"/g, '')
}

function shorten(string) {
  return string.substring(0, 30)
}
