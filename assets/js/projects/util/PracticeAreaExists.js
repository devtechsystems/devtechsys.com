import { PRACTICE_AREA_COLUMN_NAME } from '../ColumnNames'

const PracticeAreaExists = (practiceArea, project) => {
  const practiceAreasForProject = project[PRACTICE_AREA_COLUMN_NAME]
  return practiceAreasForProject.indexOf(practiceArea['displayName']) !== -1
}

export default PracticeAreaExists
