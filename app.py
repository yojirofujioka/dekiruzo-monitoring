#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def main():
    print("こんにちは！WSLからPythonを実行しています。")
    print("現在の作業ディレクトリ:")
    
    import os
    print(os.getcwd())
    
    # サンプル処理
    numbers = [1, 2, 3, 4, 5]
    total = sum(numbers)
    print(f"\n数値リスト: {numbers}")
    print(f"合計: {total}")
    print(f"平均: {total / len(numbers)}")

if __name__ == "__main__":
    main() 