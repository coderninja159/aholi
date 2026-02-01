/**
 * Aholi Muammolari — Google Sheets backend.
 * Deploy as Web App: Execute as "Me", Who has access: "Anyone".
 */

function doGet(e) {
  const action = e?.parameter?.action || ''
  let output
  if (action === 'list') {
    output = listProblems()
  } else {
    output = { error: 'Invalid action' }
  }
  return createJsonResponse(JSON.stringify(output))
}

function doPost(e) {
  let data
  try {
    data = JSON.parse(e?.postData?.contents || '{}')
  } catch (err) {
    return createJsonResponse(JSON.stringify({ error: 'Invalid JSON' }), 400)
  }
  const action = data.action
  let output
  if (action === 'submit') {
    output = appendProblem(data)
  } else if (action === 'vote') {
    output = incrementVote(data.id)
  } else {
    output = { error: 'Invalid action' }
  }
  return createJsonResponse(JSON.stringify(output))
}

function createJsonResponse(body, statusCode) {
  statusCode = statusCode || 200
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function doOptions() {
  return createJsonResponse('', 200)
}

var SHEET_NAME = 'Problems'

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(['id', 'region', 'category', 'description', 'votes', 'createdAt'])
  }
  return sheet
}

function listProblems() {
  var sheet = getSheet()
  var data = sheet.getDataRange().getValues()
  if (!data.length || data.length < 2) return []
  var headers = data[0]
  var idIdx = headers.indexOf('id')
  var regionIdx = headers.indexOf('region')
  var categoryIdx = headers.indexOf('category')
  var descIdx = headers.indexOf('description')
  var votesIdx = headers.indexOf('votes')
  var createdIdx = headers.indexOf('createdAt')
  if (idIdx < 0) idIdx = 0
  if (regionIdx < 0) regionIdx = 1
  if (categoryIdx < 0) categoryIdx = 2
  if (descIdx < 0) descIdx = 3
  if (votesIdx < 0) votesIdx = 4
  if (createdIdx < 0) createdIdx = 5
  var out = []
  for (var i = 1; i < data.length; i++) {
    var row = data[i]
    out.push({
      id: row[idIdx],
      region: row[regionIdx],
      category: row[categoryIdx],
      description: row[descIdx],
      votes: Number(row[votesIdx]) || 0,
      createdAt: row[createdIdx] ? String(row[createdIdx]) : ''
    })
  }
  return out
}

function appendProblem(data) {
  var sheet = getSheet()
  var id = 'p' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
  var region = (data.region || '').toString().slice(0, 200)
  var category = (data.category || 'Boshqa').toString().slice(0, 100)
  var description = (data.description || '').toString().slice(0, 2000)
  sheet.appendRow([id, region, category, description, 0, new Date().toISOString()])
  return { id: id, ok: true }
}

function incrementVote(id) {
  if (!id) return { error: 'Missing id' }
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(10000)
  } catch (e) {
    return { error: 'Lock timeout' }
  }
  try {
    var sheet = getSheet()
    var data = sheet.getDataRange().getValues()
    var headers = data[0]
    var idIdx = headers.indexOf('id')
    var votesIdx = headers.indexOf('votes')
    if (idIdx < 0) idIdx = 0
    if (votesIdx < 0) votesIdx = 4
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idIdx]) === String(id)) {
        var current = Number(data[i][votesIdx]) || 0
        sheet.getRange(i + 1, votesIdx + 1).setValue(current + 1)
        return { ok: true, votes: current + 1 }
      }
    }
    return { error: 'Not found' }
  } finally {
    lock.releaseLock()
  }
}
