#!/usr/bin/env node

var str = []
process.stdin
  .setEncoding('utf-8')
  .on('readable', function () {
    var chunk
    while (chunk = process.stdin.read()) {
      if (chunk) {
        str.push(chunk)
      }
    }
  })
  .on('end', function () {
    var verts = []
    var faces = []

    str.join('').split('\n').forEach(function (line) {
      var toks = line.split(/\s+/)
      if (toks[0] === 'v') {
        verts.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'f') {
        faces.push(toks.slice(1).map((x) => (x - 1) | 0))
      }
    })

    console.log(JSON.stringify({
      positions: verts,
      cells: faces
    }))
  })
