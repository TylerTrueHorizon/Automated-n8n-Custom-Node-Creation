function byId(id){return document.getElementById(id);} 
const specArea = byId('spec');
const loadBtn = byId('load');
const optionsDiv = byId('options');
const pathSelect = byId('pathSelect');
const methodSelect = byId('methodSelect');
const nodeNameInput = byId('nodeName');
const generateBtn = byId('generate');
const outputPre = byId('output');
let specObj = null;

loadBtn.onclick = () => {
  try {
    specObj = JSON.parse(specArea.value);
    pathSelect.innerHTML = '';
    Object.keys(specObj.paths || {}).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      pathSelect.appendChild(opt);
    });
    updateMethods();
    optionsDiv.style.display = 'block';
  } catch(err) {
    alert('Invalid JSON');
  }
};

pathSelect.onchange = updateMethods;

function updateMethods(){
  const p = pathSelect.value;
  methodSelect.innerHTML = '';
  if(specObj && specObj.paths[p]){
    Object.keys(specObj.paths[p]).forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m.toUpperCase();
      methodSelect.appendChild(opt);
    });
  }
}

generateBtn.onclick = async () => {
  const body = {
    spec: specObj,
    nodeName: nodeNameInput.value || 'CustomNode',
    apiPath: pathSelect.value,
    method: methodSelect.value,
  };
  const res = await fetch('/generate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if(data.error){
    outputPre.textContent = 'Error: ' + data.error;
  } else {
    outputPre.textContent = data.code;
  }
};
