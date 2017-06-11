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
    var vt = []
    var vn = []
    var faces = []
    var uv = []
    var normals = []

    str.join('').split('\n').forEach(function (line) {
      var toks = line.split(/\s+/)
      if (toks[0] === 'v') {
        verts.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'vt') {
        vt.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'vn') {
        vn.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'f') {
        var f = [], t = [], n = []
        for (var i = 1; i < toks.length; i++) {
          var vtn = toks[i].split('/')
          f.push((vtn[0] - 1) | 0)
          if (vtn[1]) t.push(vt[(vtn[1]-1)|0]) // texture index
          if (vtn[2]) n.push(vn[(vtn[2]-1)|0]) // normal index
        }
        faces.push(f)
        if (t.length > 0) uv.push(t)
        if (n.length > 0) normals.push(n)
      }
    })

    var data = {
      positions: verts,
      cells: faces
    }
    if (uv.length) {
      data.uv = uv
    }
    if (normals.length) {
      data.normals = normals
    }
    console.log(JSON.stringify(data))
  })
