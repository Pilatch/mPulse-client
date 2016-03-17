Attribute VB_Name = "mPulseCsvChartModule"
Sub LineChartFirst4Columns()
Attribute LineChartFirst4Columns.VB_Description = "Make a line chart from first 4 columns"
Attribute LineChartFirst4Columns.VB_ProcData.VB_Invoke_Func = "C\n14"
'
' LineChartFirst4Columns Macro
' Make a line chart from first 4 columns
'
' Keyboard Shortcut: Option+Cmd+Shift+C
'

    Range("D1").Select
    Selection.End(xlDown).Select
    Dim bottomRightCornerAddress As String
    bottomRightCornerAddress = ActiveCell.Address
    Range("A1:" & bottomRightCornerAddress).Select
    Range(bottomRightCornerAddress).Activate
    ActiveWindow.ScrollRow = 1
    ActiveSheet.Shapes.AddChart.Select
    ActiveChart.ChartType = xlLine
    
    ActiveChart.SetSourceData Source:=Range( _
        "'" & ActiveSheet.Name & "'!$A$1:" & bottomRightCornerAddress)
    ActiveSheet.Shapes("Chart 1").ScaleWidth 2.1861111111, msoFalse, _
        msoScaleFromBottomRight
    ActiveSheet.Shapes("Chart 1").ScaleHeight 1.9583333333, msoFalse, _
        msoScaleFromBottomRight
    ActiveChart.SeriesCollection(3).Select
    ActiveChart.SeriesCollection(3).AxisGroup = xlSecondary
    ActiveSheet.ChartObjects("Chart 1").Activate
    ActiveChart.SeriesCollection(3).Select
    ActiveChart.SeriesCollection(1).Select
    ActiveChart.SeriesCollection(1).Trendlines.Add
    ActiveChart.SeriesCollection(1).Trendlines(1).Type = xlMovingAvg
    ActiveChart.SeriesCollection(1).Trendlines(1).Period = 7
    Range("A1").Select
    Dim newWorkbookName As String
    newWorkbookName = Replace(Application.ActiveWorkbook.FullName, ".csv", ".xlsx")
    ActiveWorkbook.SaveAs Filename:= _
        newWorkbookName _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False
    
End Sub

