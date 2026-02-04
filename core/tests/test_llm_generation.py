
import pytest
import os
from app.services.ai_service import generate_visualization_rules
from unittest.mock import patch, MagicMock
from langchain_core.messages import AIMessage

@patch('app.services.ai_service.ChatGoogleGenerativeAI')
@patch.dict(os.environ, {"GEMINI_API_KEY": "dummy_key"})
def test_generate_visualization_rules(mock_llm_class):
    # Mock the LLM instance and its invoke method
    mock_llm_instance = MagicMock()
    mock_llm_class.return_value = mock_llm_instance
    
    # Mock response content
    mock_response = AIMessage(content='''
    [
        {
            "type": "bar",
            "title": "Test Chart",
            "x": "Category",
            "y": "Value",
            "description": "A test chart"
        }
    ]
    ''')
    mock_llm_instance.invoke.return_value = mock_response

    # Dummy analysis result
    analysis_result = {
        "metadata": {"Category": "object", "Value": "int64"},
        "summary": {"Category": {"unique": 3}, "Value": {"mean": 10}}
    }
    
    rules = generate_visualization_rules(analysis_result)
    
    assert len(rules) == 1
    assert rules[0]['type'] == 'bar'
    assert rules[0]['x'] == 'Category'

@patch('app.services.ai_service.ChatGoogleGenerativeAI')
def test_generate_visualization_rules_error_handling(mock_llm_class):
    # Simulate an exception
    mock_llm_instance = MagicMock()
    mock_llm_class.return_value = mock_llm_instance
    mock_llm_instance.invoke.side_effect = Exception("API Error")
    
    rules = generate_visualization_rules({})
    assert rules == []
