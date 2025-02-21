"use strict";

const schemaid = /^[a-zA-Z]{4}[0-9]{4}$/;
const schemamail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const schemaname = /^[a-zA-Z ]+$/;

function getCookie(cname)
{
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for (let cookie of ca)
  {
    const c = cookie.trim();
    if (c.startsWith(name))
      return c.substring(name.length,c.length);
  }
  return "";
}

function $(id)
{
  return document.getElementById(id);
}

function $add(type, parent, params, content)
{
  const element = document.createElement(type);
  if (typeof params == 'object')
  {
    for (let param in params)
    {
      if (param == 'class')
      {
        const list = params[param].split(' ');
        for (let classElement of list)
          element.classList.add(classElement);
      }
      else
        element.setAttribute(param, params[param]);
    }
  }
  if (typeof content == 'string')
    element.appendChild(document.createTextNode(content));
  parent.appendChild(element);
  return element;
}

function init()
{
  $('get').onclick = getuser;
  document.body.addEventListener("keyup", (e) =>
  {
    console.log(e.code);
    if (e.code === 'Enter' || e.code === 'NumpadEnter')
      $('get').click();
  });
}

async function getuser()
{
  if ($('search').value == '')
    return;
  $('content').innerHTML = '';
  $('error').innerHTML = '';
  try
  {
    let response;
    let phase = '';
    if ($('search').value.match(schemaid))
      response = await fetch(getCookie('swwapi') + '/users/' + $('search').value);
    else if ($('search').value.match(schemamail))
      response = await fetch(getCookie('swwapi') + '/users?mail=' + $('search').value);
    else if ($('search').value.match(schemaname))
    {
      phase = 'surname';
      response = await fetch(getCookie('swwapi') + '/users?surname=' + $('search').value);
      if (!response.ok && phase == 'surname')
        response = await fetch(getCookie('swwapi') + '/users?forename=' + $('search').value);
    }
    else
    {
      $('error').innerHTML = 'error : bad input format, must be an id (4 letters 4 digits), a mail, a surname or a forename';
      return;
    }
    if (!response.ok)
    {
      const err = await response.json();
      $('error').innerHTML = 'error : ' + response.status + ' ' + err.message;
      return;
    }
    const user = await response.json();
    const row = $add('div', $('content'), {class:'row d-flex justify-content-center text-center'});
    const col1 = $add('div', row, {class:'col my-2'})
    $add('img', col1, {class:'img-fluid', alt:user.surname + 'picture', src:user.surname+'.jpg'}, '');
    const col2 = $add('div', row, {class:'col my-2'})
    const ul = $add('ul', col2, {style:'display:inline-block', class:'list-group'});
    $add('li', ul, {class:'list-group-item active'}, user.surname + ' ' + user.forename);
    $add('li', ul, {class:'list-group-item'}, user.surname);
    $add('li', ul, {class:'list-group-item'}, user.forename);
    $add('li', ul, {class:'list-group-item'}, user.mail);
    $add('li', ul, {class:'list-group-item'}, user.id);
  }
  catch (error)
  {
    $('error').innerHTML = 'error : ' + error.message;
  }
}
