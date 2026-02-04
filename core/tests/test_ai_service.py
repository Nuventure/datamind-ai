
import pytest
import pandas as pd
import numpy as np
from app.services.ai_service import extract_metadata, generate_statistical_summary

def test_extract_metadata():
    df = pd.DataFrame({
        'A': [1, 2, 3],
        'B': ['x', 'y', 'z'],
        'C': [1.1, 2.2, 3.3]
    })
    metadata = extract_metadata(df)
    assert metadata['A'] == 'int64'
    assert metadata['B'] == 'object'
    assert metadata['C'] == 'float64'

def test_generate_statistical_summary_numeric():
    df = pd.DataFrame({
        'A': [1, 2, 3, 4, 5]
    })
    summary = generate_statistical_summary(df)
    assert summary['A']['count'] == 5
    assert summary['A']['mean'] == 3.0
    assert summary['A']['min'] == 1
    assert summary['A']['max'] == 5
    assert summary['A']['missing_values'] == 0
    assert summary['A']['unique_values'] == 5

def test_generate_statistical_summary_object():
    df = pd.DataFrame({
        'B': ['a', 'b', 'a', 'c']
    })
    summary = generate_statistical_summary(df)
    assert summary['B']['count'] == 4
    assert summary['B']['unique'] == 3
    assert summary['B']['top'] == 'a'
    assert summary['B']['freq'] == 2
    assert summary['B']['unique_values'] == 3

def test_generate_statistical_summary_with_nulls():
    df = pd.DataFrame({
        'A': [1, 2, np.nan]
    })
    summary = generate_statistical_summary(df)
    # Count in describe() usually excludes NaNs, so count should be 2
    assert summary['A']['count'] == 2
    assert summary['A']['missing_values'] == 1
