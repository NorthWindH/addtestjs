require(['math.min', 'gladius', 'browser_detect'], function(m, g, browser_detect){
    var form = document.getElementsByTagName('form')[0];
    function print(text) {
      var elem = document.createElement("h1");
      var newContent = document.createTextNode(text);
      elem.appendChild(newContent);
      document.body.insertBefore(elem, form);
      console.log(text);
    }

    function print2(text) {
      var elem = document.createElement("h3");
      var newContent = document.createTextNode(text);
      elem.appendChild(newContent);
      document.body.insertBefore(elem, form);
      console.log(text);
    }

    function get(name){
       if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
          return decodeURIComponent(name[1]);
    }

    browser_detect.init();

    g = new g();
    var elems = get('elems');
    if (elems === '') {
        elems = 10000;
    } else {
        try {
            elems = parseInt(elems);
        } catch (e) {
            elems = 10000;
        }

        if (isNaN(elems)) {
            elems = 10000;
        }
    }

    document.getElementById('elems').value = elems;
    if (get('chrome_hack')) {
        document.getElementById('chrome_hack').checked = true;
    }
    var min_val = -100, max_val = 100, diff = max_val - min_val, a = [], b = [], r = [];
    print('Beginning testing with ' + elems + ' elements.');
    print2('Testing mathjs (newest version of gladius math library)');
    if (get('chrome_hack')) {
        print2("Chrome hack active, skipping mathjs test...");
        m_start_clock = 0;
        m_end_clock = 0;
    } else {
        for (var i = 0; i < elems; ++i) {
            a.push(m.Vector([
                min_val + Math.random() * diff,
                min_val + Math.random() * diff,
                min_val + Math.random() * diff
            ]));
            b.push(m.Vector([
                min_val + Math.random() * diff,
                min_val + Math.random() * diff,
                min_val + Math.random() * diff
            ]));
            r.push(m.Vector([0,0,0]));
        }

        m_start_clock = Date.now();
        var add = m.add;
        for (var i = 0; i < elems; ++i) {
            add(a[i], b[i], r[i]);
        }
        m_end_clock = Date.now();
    }

    print2('Testing old gladius/math library (before the refactor to mathjs)');
    a = [], b = [], r = [];
    for (var i = 0; i < elems; ++i) {
        a.push(g.Vector3(
            min_val + Math.random() * diff,
            min_val + Math.random() * diff,
            min_val + Math.random() * diff
        ));
        b.push(g.Vector3(
            min_val + Math.random() * diff,
            min_val + Math.random() * diff,
            min_val + Math.random() * diff
        ));
        r.push(g.Vector3());
    }

    g_start_clock = Date.now();
    add = g.vector3.add;
    for (var i = 0; i < elems; ++i) {
        add(a[i], b[i], r[i]);
    }
    g_end_clock = Date.now();

    add = function(a, b, c) {
        c = c || [];
        c[0] = a[0] + b[0];
        c[1] = a[1] + b[1];
        c[2] = a[2] + b[2];
        return c;
    };

    var add2 = function(a, b, c) {
        c[0] = a[0] + b[0];
        c[1] = a[1] + b[1];
        c[2] = a[2] + b[2];
    };

    print2('Testing in-house add1 function, checks for existence of result object, creates if required, returns result...');
    a = [], b = [], r = [];
    for (var i = 0; i < elems; ++i) {
        a.push([
            min_val + Math.random() * diff,
            min_val + Math.random() * diff,
            min_val + Math.random() * diff
        ]);
        b.push([
            min_val + Math.random() * diff,
            min_val + Math.random() * diff,
            min_val + Math.random() * diff
        ]);
        r.push([]);
    }

    a1_start_clock = Date.now();
    for (var i = 0; i < elems; ++i) {
        add(a[i], b[i], r[i]);
    }
    a1_end_clock = Date.now();

    print2('Testing in-house add2 function, does not create result, does not return...');
    a = [], b = [], r = [];
    for (var i = 0; i < elems; ++i) {
        a.push([
            min_val + Math.random() * diff,
            min_val + Math.random() * diff,
            min_val + Math.random() * diff
        ]);
        b.push([
            min_val + Math.random() * diff,
            min_val + Math.random() * diff,
            min_val + Math.random() * diff
        ]);
        r.push([]);
    }

    a2_start_clock = Date.now();
    for (var i = 0; i < elems; ++i) {
        add2(a[i], b[i], r[i]);
    }
    a2_end_clock = Date.now();
    print('Testing complete, printing results.');
    print('m  diff: ' + (m_end_clock - m_start_clock) + 'ms');
    print('g  diff: ' + (g_end_clock - g_start_clock) + 'ms');
    print('a1 diff: ' + (a1_end_clock - a1_start_clock) + 'ms');
    print('a2 diff: ' + (a2_end_clock - a2_start_clock) + 'ms');
});