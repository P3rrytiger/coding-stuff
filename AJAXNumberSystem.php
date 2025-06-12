<?php
	include("numberSystem.php");
	error_reporting(E_ALL); ini_set('display_errors', TRUE); ini_set('display_startup_errors', TRUE);
	$numberSystem = new NumberSystem;
	//$action = $_REQUEST["action"];
	$action = $_POST["action"];
	//$inputA = $_REQUEST["inputA"];
	//$inputB = $_REQUEST["inputB"];
	
	switch ($action) {
		case 'B10toB21':
			echo json_encode( $numberSystem->B10toB21($inputA) );
			break;
		
		default:
			// code...
			break;
	}
	
	if($action != 'B10toB21'){
		$in = json_decode($action);
		$instructions = $in->instructions;
		$vars = $in->vars;
		
		for($i=0; $i<count($instructions); $i++){
			$step = $instructions[$i];
			
			switch($step->action){
				case 'rand':
					$vars[$step->out] = rand(1, $vars[$step->input->inputA]);
					break;
				
				case 'B10toB21':
					$vars[$step->out] = $numberSystem->B10toB21( $vars[$step->input->inputA] );
					break;
					
				case 'write':
					$vars[$step->out] = $step->input->inputA;
					break;
					
				case 'add':
					$vars[$step->out] = $vars[$step->input->inputA] + $vars[$step->input->inputB];
					break;
			}
		}
		
		echo json_encode($vars);
	}

?>
