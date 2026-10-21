const $=s=>document.querySelector(s), form=$('#form');
let page=1,total=0,editing=null,items=[];
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,method='GET',body){
 const res=await fetch(path,{method,headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await res.json(); if(!res.ok)throw new Error(JSON.stringify(data,null,2)); return data;
}
function error(e){$('#error').hidden=false;$('#error').textContent=e.message;}
async function load(){try{
 $('#error').hidden=true;
 const params=new URLSearchParams({page,search:$('#search').value,status:$('#status').value,min:$('#min').value,sort:$('#sort').value});
 const data=await api('/api/customers?'+params);items=data.items;total=data.total;
 $('#rows').innerHTML=items.length?items.map(r=>`<tr><td><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.email)}</small></td><td>${escapeHtml(r.cpf)}</td><td>${escapeHtml(r.phone)}</td><td>${Number(r.credit).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td><span class="badge">${escapeHtml(r.status)}</span></td><td><button class="secondary" data-edit="${r.id}">Editar</button><button class="danger" data-delete="${r.id}">Excluir</button></td></tr>`).join(''):'<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
 $('#count').textContent=total+' clientes encontrados';$('#page').textContent='Página '+page;$('#prev').disabled=page===1;$('#next').disabled=page*5>=total;
 }catch(e){error(e);}}
function openEditor(row){editing=row?.id??null;form.reset();if(row)for(const [k,v]of Object.entries(row))if(form.elements.namedItem(k))form.elements.namedItem(k).value=v;
 $('#formTitle').textContent=row?'Editar cliente':'Novo cliente';$('#editor').hidden=false;form.elements.name.focus();}
$('#new').onclick=()=>openEditor();$('#cancel').onclick=()=>{$('#editor').hidden=true;};
$('#filter').onclick=load;
$('#clear').onclick=()=>{$('#search').value='';$('#min').value='';load();};
$('#prev').onclick=()=>{page--;load();};$('#next').onclick=()=>{page++;load();};
$('#rows').onclick=async e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit)openEditor(items.find(r=>r.id==edit));if(del){try{await api('/api/customers/'+del,'DELETE');$('#notice').textContent='Cliente excluído com sucesso.';await load();}catch(err){error(err);}}};
form.onsubmit=async e=>{e.preventDefault();try{await api('/api/customers'+(editing?'/'+editing:''),editing?'PUT':'POST',Object.fromEntries(new FormData(form)));$('#editor').hidden=true;$('#notice').textContent='Cliente salvo com sucesso.';await load();}catch(err){error(err);}};
form.elements.cpf.oninput=e=>{let v=e.target.value.replace(/\D/g,'').slice(0,10);e.target.value=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4');};
form.elements.phone.oninput=e=>{let v=e.target.value.replace(/\D/g,'').slice(0,10);e.target.value=v.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{4})(\d{4})$/,'$1-$2');};
form.elements.cep.oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,8).replace(/^(\d{4})(\d)/,'$1-$2');};
load();
