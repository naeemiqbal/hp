/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


            function loadMenu() {
                var fmenu = $("#floatmenu")[0],
                        itm = this, li, x, y, iid;
                //   if (itm instanceof MouseEvent || itm.__proto__ === MouseEvent)
                {
                    if (itm.target instanceof HTMLLIElement || itm.tagName === "LI")
                    {
                        li = itm.target;
                        x = itm.offsetLeft;
                        y = itm.offsetHeight;
                        iid = parseInt(itm.id.substring(2)) - 1;
                        menus = vmenuitems[iid];
                        fmenu.hidden = "";
                        fmenu.style.left = x + "px";
                        fmenu.style.top = y + "px";
                        fmenu.innerHTML = "<ul>" + menus.getHTML() + "</ul>";
                    }
                    if (iurl)
                        ifram.src = iurl;
                    else
                        ifram.src = "http://askimam.org";
                }
            }
