import 'package:flutter/material.dart';
import 'features/farmer/screens/harvest_declaration_screen.dart';

void main() {
  runApp(const AGRIFlowMobileApp());
}

class AGRIFlowMobileApp extends StatelessWidget {
  const AGRIFlowMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AGRIFlow Farmers & Consumers',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B981),
          brightness: Brightness.dark,
        ),
      ),
      home: const HarvestDeclarationScreen(),
    );
  }
}
