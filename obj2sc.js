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
    var positions = []

    str.join('').split('\n').forEach(function (line) {
      var toks = line.split(/\s+/)
      if (toks[0] === 'v') {
        verts.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'vt') {
        vt.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'vn') {
        vn.push(toks.slice(1).map((x) => +x))
      } else if (toks[0] === 'f') {
        var f = []
        for (var i = 1; i < toks.length; i++) {
          var vtn = toks[i].split('/')
          var vi = (vtn[0]-1)|0
          var pi = positions.length
          positions.push(verts[vi])
          f.push(pi)
          if (vtn[1]) uv[pi] = vt[(vtn[1]-1)|0] // texture index
          if (vtn[2]) normals[pi] = vn[(vtn[2]-1)|0] // normal index
        }
        if (f.length === 3) faces.push(f)
        else {
          for (var i = 2; i < f.length; i++) {
            faces.push([f[0],f[i-1],f[i]])
          }
        }
      }
    })

    var data = {
      positions: positions,
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
