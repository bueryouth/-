function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    /*课程表网页获取*/
    const ifr = dom.getElementById("frmbody").contentDocument;
    const ifr1 = ifr.getElementById("frmDesk").contentDocument;
    const ifr2 = ifr1.getElementById("frame_1").contentDocument;
    const ifrs = ifr2.getElementById("frmReport").contentDocument;
    return ifrs.querySelector('table').outerHTML;
}
