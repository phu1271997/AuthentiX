import pytest

@pytest.fixture(autouse=True)
def setup_gl_call_hook(direct_vm):
    def gl_call_hook(vm, request):
        if "ExecPromptTemplate" in request:
            prompt_data = request["ExecPromptTemplate"]
            input_data = prompt_data.get("input", "")
            return {"ok": input_data}
        return None
    
    direct_vm._gl_call_hook = gl_call_hook
    yield
    direct_vm._gl_call_hook = None
